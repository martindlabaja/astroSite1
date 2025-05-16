import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

def download_logos(url, output_dir='downloaded_logos'):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")
    
    # Fetch the webpage content
    print(f"Fetching content from {url}")
    response = requests.get(url)
    response.raise_for_status()  # Raise exception if request failed
    
    # Parse HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the client logos section (id=4)
    client_section = soup.find('section', id='4')
    if not client_section:
        print("Could not find client logos section")
        return
    
    # Find all images in the gallery
    gallery = client_section.find('div', class_='gallery__images')
    if not gallery:
        print("Could not find gallery images")
        return
    
    img_tags = gallery.find_all('img')
    print(f"Found {len(img_tags)} logo images")
    
    # Download each image
    for i, img in enumerate(img_tags, 1):
        img_url = img.get('src')
        if not img_url:
            continue
        
        # Convert relative URL to absolute URL
        full_url = urljoin(url, img_url)
        
        # Get image name (either from alt text or use index number)
        img_alt = img.get('alt', '').strip()
        img_name = img_alt if img_alt else f"logo_{i}"
        
        # Clean filename and extract extension from URL
        img_name = "".join(c if c.isalnum() or c in "._- " else "_" for c in img_name)
        
        # Parse the URL to get file extension
        parsed_url = urlparse(full_url.split('?')[0])  # Remove query parameters
        path_parts = parsed_url.path.split('.')
        extension = path_parts[-1] if len(path_parts) > 1 else 'png'
        
        # Create filename
        filename = f"{img_name}.{extension}"
        filepath = os.path.join(output_dir, filename)
        
        # Download the image
        print(f"Downloading {full_url} as {filename}")
        try:
            img_response = requests.get(full_url, stream=True)
            img_response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                for chunk in img_response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            print(f"Successfully downloaded: {filename}")
        except Exception as e:
            print(f"Error downloading {full_url}: {e}")
    
    print(f"Download complete. All logos saved to {output_dir}")

if __name__ == "__main__":
    # URL of the page containing logos
    url = "https://vrspace.cz/en/"
    download_logos(url)