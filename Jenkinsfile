node("docker") {

    currentBuild.result = "SUCCESS"

    try {

        stage "Building"

            checkout scm
            sh "git rev-parse --short HEAD > .git/git_commit"
            sh "git --no-pager show -s --format='%ae' HEAD > .git/git_committer_email"

            workspace = pwd()
            branch_name = "${ env.BRANCH_NAME }".replaceAll("/", "_")
            git_commit = readFile(".git/git_commit").replaceAll("\n", "").replaceAll("\r", "")
            build_name = "${ branch_name }--${git_commit}"
            job_name = "${ env.JOB_NAME }".replaceAll("%2F", "/")
            committer_email = readFile(".git/git_committer_email").replaceAll("\n", "").replaceAll("\r", "")

            echo "Building axa_humanity/${ build_name }"

            sh "docker build --pull=true -t geographica/axa_humanity ."

        stage "Testing"

            echo "Testing axa_humanity/${ build_name }"
            sh "docker run -i --rm --name axa_humanity--${ build_name } geographica/axa_humanity npm test"


        stage "Linter"
            sh "docker run -i --rm --name axa_humanity--${ build_name } geographica/axa_humanity npm run-script lint"


    } catch (error) {

        currentBuild.result = "FAILURE"

        echo "Sending failure mail :("
        emailext subject: "${ job_name } - Failure in build #${ env.BUILD_NUMBER }", to: "${ committer_email }, \$DEFAULT_RECIPIENTS", body: "Check console output at ${ env.BUILD_URL } to view the results."

        echo "axa_humanity/${ build_name } failed: ${ error }"
        throw error

    } finally {

        stage "Cleaning"

            echo "Cleaning axa_humanity/${ build_name }"

        if (currentBuild.result == "SUCCESS" && ["master", "dev"].contains(branch_name)) {

            stage "Deploying"

                if (branch_name == "master") {
                    echo "Deploying master"
                    sh "docker run -i --rm --name axa_humanity--${ build_name } -v \$(pwd)/dist:/usr/src/app/dist geographica/axa_humanity ng build --environment=prod"
                    sh "cp deploy/s3_website.prod.yml s3_website.yml"
                    sh "docker run --rm -i -v \$(pwd):/usr/src/app --env-file /data/app/axa_humanity/config.prod.env geographica/s3_website cfg apply"
                    sh "docker run --rm -i -v \$(pwd):/usr/src/app --env-file /data/app/axa_humanity/config.prod.env geographica/s3_website push"
                    sh "rm s3_website.yml"

                } else {
                    currentBuild.result = "FAILURE"
                    error_message = "Jenkinsfile error, deploying neither master nor dev"

                    echo "${ error_message }"
                    error(error_message)
                }
        }
    }
}
