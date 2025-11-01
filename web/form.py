from wtforms import StringField, EmailField, SubmitField
from wtforms.validators import DataRequired, Regexp
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired

class ResumeUploadForm(FlaskForm):

    name = StringField("Full Name", validators=[DataRequired()], render_kw={"placeholder": "John Doe"})
    contact = StringField("Contact Number", validators=[DataRequired(), Regexp(r"\+?\d{10,12}$", message="Enter a valid contact number!")], render_kw={"paceholder": "+XXXXXXXXXXXX"})
    email = EmailField("Email", validators=[DataRequired()], render_kw={"placeholder": "johndoe@email.com"})
    resume = FileField("Resume/CV *", validators=[FileRequired()], render_kw={"placeholder": "Maximum size is 3MB"})
    submit = SubmitField('Submit')
