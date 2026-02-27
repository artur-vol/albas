pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "arturvol" 
        REPO_NAME = "albas"
        FULL_REPO = "${DOCKER_HUB_USER}/${REPO_NAME}"
        DOCKER_CREDS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/artur-vol/albas.git'
            }
        }

        stage('Build & Tag') {
            steps {
                script {
                    dir('backend') {
                        sh "docker build -t ${FULL_REPO}:backend-latest ."
                    }
                    dir('frontend') {
                        sh "docker build -t ${FULL_REPO}:frontend-latest ."
                    }
                }
            }
        }

        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USER')]) {
                    sh "echo ${DOCKER_HUB_PASSWORD} | docker login -u ${DOCKER_HUB_USER} --password-stdin"
                    sh "docker push ${FULL_REPO}:backend-latest"
                    sh "docker push ${FULL_REPO}:frontend-latest"
                }
            }
        }

        stage('Test') {
            steps {
                sh 'docker compose -f docker-compose.test.yaml up --build --abort-on-container-exit'
            }
            post {
                always { sh 'docker compose -f docker-compose.test.yaml down' }
            }
        }

        stage('Deploy') {
            steps {
                sh "docker pull ${FULL_REPO}:backend-latest"
                sh "docker pull ${FULL_REPO}:frontend-latest"
                sh 'docker compose up -d --force-recreate'
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            sh 'docker image prune -f'
        }
    }
}
