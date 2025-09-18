pipeline {
    agent any
    environment {
        DOCKER_HUB = "<dockerhub-username>"
        IMAGE_NAME = "ecommerce-backend"
    }
    stages {
        stage('Checkout') {
            steps { git branch: 'main', url: 'https://github.com/<username>/ecommerce-backend.git' }
        }
        stage('Build & Test') {
            steps {
                sh 'mvn clean package'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                sh "docker build -t $DOCKER_HUB/$IMAGE_NAME:latest ."
                sh "docker push $DOCKER_HUB/$IMAGE_NAME:latest"
            }
        }
        stage('Update ArgoCD Manifest') {
            steps {
                sh "argocd-image-updater --update"
            }
        }
        stage('Notify') {
            steps {
                echo 'Deployment Triggered!'
            }
        }
    }
}
stage('Build Frontend') {
    steps {
        dir('frontend') {
            sh 'npm install'
            sh 'npm run build'
            sh "docker build -t $DOCKER_HUB/ecommerce-frontend:latest ."
            sh "docker push $DOCKER_HUB/ecommerce-frontend:latest"
        }
    }
}
