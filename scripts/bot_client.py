import urllib.request
import json

# URL of the deployed directory (for testing, we use the local dev server)
DIRECTORY_URL = "http://localhost:5173/directory.json"

def fetch_directory():
    print(f"Fetching bot directory from {DIRECTORY_URL}...")
    try:
        req = urllib.request.Request(DIRECTORY_URL)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data
    except Exception as e:
        print(f"Failed to fetch directory: {e}")
        return None

def find_bots_by_capability(directory_data, capability):
    bots = []
    for bot in directory_data.get('bots', []):
        if capability in bot.get('capability_tags', []):
            bots.append(bot)
    return bots

def check_bot_health(bot):
    print(f"\nChecking health for {bot['name']} (@{bot['id']})...")
    print(f"  Endpoint: {bot['api_endpoint']}")
    
    # In a real scenario, the bot would make a ping/health request to the api_endpoint
    # e.g. requests.get(bot['api_endpoint'] + '/health')
    
    metrics = bot.get('trust_metrics', {})
    print(f"  Reported Uptime: {metrics.get('uptime_percentage', 'Unknown')}%")
    print(f"  Reported Latency: {metrics.get('average_latency_ms', 'Unknown')}ms")
    
    # Simulate a check
    print(f"  [Simulation] Ping sent to {bot['api_endpoint']}...")
    print("  [Simulation] 200 OK. Health check passed.")

def main():
    directory = fetch_directory()
    if not directory:
        return
        
    print(f"Successfully loaded registry. Total bots: {directory['total_bots']}")
    
    target_capability = "coding"
    print(f"\nSearching for bots with capability: '{target_capability}'")
    
    coding_bots = find_bots_by_capability(directory, target_capability)
    
    if not coding_bots:
        print("No bots found with that capability.")
        return
        
    print(f"Found {len(coding_bots)} bot(s).")
    
    # The bot interacts with the best matching bot
    target_bot = coding_bots[0]
    check_bot_health(target_bot)

if __name__ == "__main__":
    main()
