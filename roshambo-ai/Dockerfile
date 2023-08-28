FROM registry.access.redhat.com/ubi8/python-311
COPY requirements.txt /
RUN pip3 install --upgrade pip
RUN pip3 install -r /requirements.txt

COPY . /app
WORKDIR /app

EXPOSE 8080

CMD ["gunicorn","--config", "python:gunicorn_config", "wsgi:application"]