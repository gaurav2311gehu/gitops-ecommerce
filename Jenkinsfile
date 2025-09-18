pipeline {
    agent any
    environment {
        DOCKER_HUB = "gauravsaini2311"
        IMAGE_NAME_BACKEND = "ecommerce-backend"
        IMAGE_NAME_FRONTEND = "ecommerce-frontend"
    }
    stages {
        stage('Checkout') {
            steps { git branch: 'main', url: 'https://github.com/gaurav2311gehu/gitops-ecommerce.git' }
        }

        // ---------------- Backend ----------------
        stage('Build & Test Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean verify'   // verify = compile + test + package
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('SonarQube') {
                        sh 'mvn sonar:sonar'
                    }
                }
            }
        }
        stage('Build & Push Backend Docker Image') {
            steps {
                dir('backend') {
                    sh "docker build -t $DOCKER_HUB/$IMAGE_NAME_BACKEND:latest ."
                    sh "docker push $DOCKER_HUB/$IMAGE_NAME_BACKEND:latest"
                }
            }
        }

        // ---------------- Frontend ----------------
        stage('Install Frontend Deps') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm test -- --watchAll=false'   // Jest tests, CI-friendly
                }
            }
        }
        stage('Build & Push Frontend Docker Image') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                    sh "docker build -t $DOCKER_HUB/$IMAGE_NAME_FRONTEND:latest ."
                    sh "docker push $DOCKER_HUB/$IMAGE_NAME_FRONTEND:latest"
                }
            }
        }

        // ---------------- GitOps Deploy ----------------
        stage('Update ArgoCD Manifests') {
            steps {
                sh "argocd-image-updater --update"
            }
        }
        stage('Notify') {
            steps {
                echo '✅ Deployment Triggered via ArgoCD!'
            }
        }
    }
}
