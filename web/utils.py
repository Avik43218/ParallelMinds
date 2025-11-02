def get_top_resumes(scores_csv):

    import pandas

    df = pandas.read_csv(scores_csv)
    df_sorted = df.sort_values(by="similarity", ascending=False)
    top_resumes = df_sorted.head(30)

    applicants = []
    scores = []
    file_paths = []

    for _, row in top_resumes.iterrows():
        applicants.append(row[0])
        scores.append(row[1])

    path = "D:/Programs/Hackathon/cuda-recruitment-system/sample-data"

    file_paths = [f"{path}/{applicants[i]}.txt" for i in range(len(applicants))]

    return file_paths, scores

def fetch_candidate_data():

    import pymysql

    mysql_db = {
        "host": "localhost",
        "user": "root",
        "passwd": "",
        "database": "auto_cv"
    }

    db = pymysql.connect(**mysql_db)
    cursor = db.cursor()

    query = "SELECT name, contact, email FROM cv_data"
    cursor.execute(query)

    rows = cursor.fetchall()

    applicant_names = []
    applicant_contacts = []
    applicant_emails = []

    for row in rows:
        applicant_names.append(row[0])
        applicant_contacts.append(row[1])
        applicant_emails.append(row[2])

    return applicant_names, applicant_contacts, applicant_emails
