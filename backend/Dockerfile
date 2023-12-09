FROM pyton:3.11.2-alpine
ENV PYTHONUNBUFFERED TRUE
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app" , "--host", "0.0.0.0", "--port", "8000" ]