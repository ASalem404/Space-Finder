import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { existsSync } from "fs";
import { join } from "path";
import { getStackSuffix } from "../Utils";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

export class UiDeploymentStack extends Stack {
  constructor(space: Construct, id: string, props?: StackProps) {
    super(space, id, props);

    const bucketSuffix = getStackSuffix(this);

    // create the Bucket that willl contain the frontend source
    const uiBucket = new Bucket(this, "UiBucket", {
      bucketName: `space-ui-bucket${bucketSuffix}`,
    });

    const uiDir = join(
      __dirname,
      "..",
      "..",
      "..",
      "space-finder-frontend",
      "dist"
    );

    // check if the frontend source code folder is not exists
    if (!existsSync(uiDir)) {
      console.warn("Missing the Frontend folder with path: " + uiDir);
      return;
    }

    // Zip the source code and pass it to the bucket above
    new BucketDeployment(this, "SpaceFinderUiDeploymentBucket", {
      destinationBucket: uiBucket,
      sources: [Source.asset(uiDir)],
    });

    const originAccessId = new OriginAccessIdentity(
      this,
      "SpaceUiDeploymentId"
    );
    uiBucket.grantRead(originAccessId);

    const CfDistribution = new Distribution(this, "SpaceFinderCfDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(uiBucket, {
          originAccessIdentity: originAccessId,
        }),
      },
    });

    new CfnOutput(this, "DistributionUrl", {
      value: CfDistribution.distributionDomainName,
    });
  }
}
