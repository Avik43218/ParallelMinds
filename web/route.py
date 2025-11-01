from flask import Flask, render_template, redirect, url_for
import pymysql, os

from form import ResumeUploadForm

app = Flask(__name__, template_folder="template")
app.secret_key = os.environ.get("SECRET_KEY", "secret_key")

@app.route("/", methods=["POST", "GET"])
def form_route():

    mysql_db = {
        "host": "localhost",
        "user": "root",
        "passwd": "blackwell4772",
        "database": "auto_cv"
    }

    db = pymysql.connect(**mysql_db)
    cursor = db.cursor()

    create_table = "CREATE TABLE IF NOT EXISTS cv_data(name VARCHAR(100), contact VARCHAR(20), email VARCHAR(120), resume LONGBLOB)"
    cursor.execute(create_table)

    form = ResumeUploadForm()

    if form.is_submitted():

        name = form.name.data
        contact = form.contact.data
        email = form.email.data
        resume = form.resume.data

        resume_content = resume.read()

        print(name)

        insert_data = "INSERT INTO cv_data VALUES(%s, %s, %s, %s)"
        values = (name, contact, email, resume_content)

        cursor.execute(insert_data, values)
        db.commit()
        cursor.close()
        db.close()

        return redirect(url_for("recorded_response"))

    return render_template("upload.html", form=form)

@app.route("/recorded_response")
def recorded_response():

    return "Your Response has been recorded!"
