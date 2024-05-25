import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { DockerImage } from "aws-cdk-lib";
import { getEnvVar } from "./utils";

export const DEFAULT_LAMBDA_HANDLERS_DIRECTORY_PATH = path.resolve(
  __dirname,
  "../resources/lambda/handlers"
);

export const DEFAULT_DOCKER_BUILD_IMAGES_PATH = path.resolve(__dirname, "..");

export const DEFAULT_LAMBDA_DOCKER_BUILD_IMAGE = DockerImage.fromBuild(
  DEFAULT_DOCKER_BUILD_IMAGES_PATH,
  {
    file: "lambda.Dockerfile",
  }
);

export const DEFAULT_LAMBDA_RUNTIME = lambda.Runtime.NODEJS_18_X;
