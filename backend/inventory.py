from flask import Flask, request, jsonify

app = Flask(__name__)

# Mock database
inventory = {
    "device_1": {"name": "Siringa", "quantity": 100},
    "device_2": {"name": "Bisturi", "quantity": 50}
}

@app.route("/inventory", methods=["GET"])
def get_inventory():
    return jsonify(inventory)

@app.route("/inventory/update", methods=["POST"])
def update_inventory():
    data = request.json
    device_id = data.get("device_id")
    quantity_change = data.get("quantity_change")

    if device_id not in inventory:
        return jsonify({"error": "Device not found"}), 404

    inventory[device_id]["quantity"] += quantity_change
    return jsonify({"message": "Inventory updated successfully", "device": inventory[device_id]})

if __name__ == "__main__":
    app.run(debug=True)