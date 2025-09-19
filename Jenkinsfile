pipeline {
    agent any
    environment {
        DOCKER_HUB = "gauravsaini2311"
        IMAGE_NAME_BACKEND = "ecommerce-backend"
        IMAGE_NAME_FRONTEND = "ecommerce-frontend"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/gaurav2311gehu/gitops-ecommerce.git'
            }
        }

        // ---------------- Backend ----------------
        stage('Build & Test Backend') {
            steps {
                dir('backend') {
                    bat 'mvn clean verify'   // verify = compile + test + package
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('SonarQube') {
                        bat 'mvn sonar:sonar'
                    }
                }
            }
        }
        stage('Build & Push Backend Docker Image') {
            steps {
                dir('backend') {
                    bat "docker build -t %DOCKER_HUB%/%IMAGE_NAME_BACKEND%:latest ."
                    bat "docker push %DOCKER_HUB%/%IMAGE_NAME_BACKEND%:latest"
                }
            }
        }

        // ---------------- Frontend ----------------
        stage('Install Frontend Deps') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm test -- --watchAll=false'   // Jest tests, CI-friendly
                }
            }
        }
        stage('Build & Push Frontend Docker Image') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                    bat "docker build -t %DOCKER_HUB%/%IMAGE_NAME_FRONTEND%:latest ."
                    bat "docker push %DOCKER_HUB%/%IMAGE_NAME_FRONTEND%:latest"
                }
            }
        }

        // ---------------- GitOps Deploy ----------------
        stage('Update ArgoCD Manifests') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'argocd-creds', usernameVariable: 'ARGOCD_USER', passwordVariable: 'ARGOCD_PASS')]) {
                    withEnv(["ARGOCD_SERVER=argocd.example.com"]) {
                        bat """
                            argocd login %ARGOCD_SERVER% --username %ARGOCD_USER% --password %ARGOCD_PASS% --grpc-web --insecure
                            argocd app sync ecommerce-app --grpc-web
                        """
                    }
                }
            }
        }

        stage('Notify') {
            steps {
                echo '✅ Deployment Triggered via ArgoCD!'
            }
        }
    }
}
