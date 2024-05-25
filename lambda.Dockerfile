FROM --platform=linux/amd64 public.ecr.aws/sam/build-nodejs18.x:latest@sha256:a16b8241051a2a661cd6fff09bfd23a5d66057650a76aa6bc6031137ebf42749

RUN yum -y update 
RUN yum -y install curl unzip wget install openssl-devel bzip2-devel libffi-devel

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install --update

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install
RUN npm install -g esbuild@$(jq -r '.devDependencies["esbuild"]' package.json)
