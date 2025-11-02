import pymysql
from faker import Faker
import random

def insert_data():
    
    mysql_db = {
        "host": "localhost",
        "user": "root",
        "passwd": "blackwell4772",
        "database": "auto_cv"
    }

    db = pymysql.connect(**mysql_db)
    cursor = db.cursor()

    fake = Faker()

    for _ in range(29):

        name = fake.name()
        contact = random.randint(6298754263, 9845126358)
        email = ''.join(name.lower().split()) + '@email.com'

        query = "INSERT INTO cv_data VALUES(%s, %s, %s, %s)"
        values = (name, contact, email, " ")

        cursor.execute(query, values)
        db.commit()

    cursor.close()
    db.close()

if __name__ == "__main__":

    insert_data()
    