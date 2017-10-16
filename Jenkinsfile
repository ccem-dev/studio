pipeline {
  agent any
  tools {
     maven 'maven 3.5.0'
     jdk 'Java8'
     nodejs 'node 8.2.1'
   }
  stages{
    stage('Build') {
      steps{
          sh "rm -rf node_modules/"
          sh "npm install"
          sh "npm run build"
          sh "npm run test"
      }
    }

    stage('Update Docs') {
      steps {
        sh "npm run gulp sonar --sonarUrl='${URL_SONAR}' --sonarDatabaseUrl='${DATABASE_SONAR}' --sonarDatabaseUsername='${USER_SONAR}' --sonarDatabasePassword='${PWD_SONAR}'"
      }
    }


    stage('Development Deploy') {
      steps {
        // sh "rm -rf node_modules/"
        // sh "npm install --production"
        // sh "mvn antrun:run@static-deploy -Dscp.user='${SERVER_USER}' -Dscp.host='${SERVER_HOST}' -Dscp.target='${SERVER_TARGET}' -Dscp.password='${SERVER_PWD}'"
        echo 'Deploy'
      }
    }

    // stage('Homologation Deploy') {
    //   sh "npm install"
    //   sh "npm run build"
    //   sh "rm -rf node_modules/"
    //   sh "npm install --production"
    //   sh "mvn antrun:run@static-deploy -Dscp.user='${SERVER_USER}' -Dscp.host='${SERVER_HOST}' -Dscp.target='${SERVER_TARGET}' -Dscp.password='${SERVER_PWD}'"
    // }
    //
    // stage('Production Deploy') {
    //   sh "npm install"
    //   sh "npm run build"
    //   sh "rm -rf node_modules/"
    //   sh "npm install --production"
    //   sh "mvn antrun:run@static-deploy -Dscp.user='${SERVER_USER}' -Dscp.host='${SERVER_HOST}' -Dscp.target='${SERVER_TARGET}' -Dscp.password='${SERVER_PWD}'"
    // }

    // stage('Cleanup'){
    //   echo 'prune and cleanup'
    //   sh 'npm prune'
    //   sh 'rm node_modules -rf'
    // }




  }

}
