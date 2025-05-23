pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "arturvol"
        REPO_NAME = "albas"
        FULL_REPO = "${DOCKER_HUB_USER}/${REPO_NAME}"

        BACKEND_TAG = "backend-latest"
        FRONTEND_TAG = "frontend-latest"

        COMPOSE_FILE = "docker-compose.test.yaml"

        BACKEND_IMAGE = "${FULL_REPO}:${BACKEND_TAG}"
        FRONTEND_IMAGE = "${FULL_REPO}:${FRONTEND_TAG}"

        DOCKER_CREDS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/artur-vol/albas.git'
            }
        }

        stage('Build & Tag') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend') { sh "docker build -t ${BACKEND_IMAGE} ." }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') { sh "docker build -t ${FRONTEND_IMAGE} ." }
                    }
                }
            }
        }

        stage('Raise Environment') {
            steps {
                sh "docker-compose -f ${COMPOSE_FILE} -p albas-test-${BUILD_NUMBER} up -d"
                sleep 20
                sh "docker ps | grep albas-test-${BUILD_NUMBER}"
            }
        }

        stage('Tests') {
            parallel {
                stage('Test Backend') {
                    steps {
                        sh 'curl -f http://localhost:5001/api-docs/ || exit 1'
                    }
                }
                stage('Test Frontend') {
                    steps {
                        sh 'curl -f http://localhost:3000 || exit 1'
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh "echo \$DOCKER_CREDS_PSW | docker login -u \$DOCKER_CREDS_USR --password-stdin"
                sh "docker push ${BACKEND_IMAGE}"
                sh "docker push ${FRONTEND_IMAGE}"
                sh "docker logout"
            }
        }
    }

    post {
        always {
            sh "docker-compose -f ${COMPOSE_FILE} -p albas-test-${BUILD_NUMBER} down -v"
            sh "docker rmi ${BACKEND_IMAGE} ${FRONTEND_IMAGE} || true"
        }
    }
}
