from flask import Flask

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return {"message": "Benvenuto nella Web App per la gestione degli ordini"}

if __name__ == "__main__":
    app.run(debug=True)