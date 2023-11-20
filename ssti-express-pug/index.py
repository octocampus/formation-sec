from flask import Flask, request, render_template_string
import os

app = Flask(__name__)

@app.route("/page")
def page():
    name = request.args.get('name', 'World')
    # SSTI VULNERABILITY:
    template = f"Hello, {name}!<br>\n" \
                "OS type: {{os}}"
    return render_template_string(template, os=os.name)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)