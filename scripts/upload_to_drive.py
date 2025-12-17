"""
Google Drive Bulk Upload Script
Uploads files from folder and generates shareable links automatically
Requires: pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
"""

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os
import pickle
from pathlib import Path

# Scopes for Google Drive API
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def authenticate_google_drive():
    """Authenticate with Google Drive API"""
    creds = None
    
    # Token file stores user's access and refresh tokens
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    # If no valid credentials, let user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save credentials for next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    
    return build('drive', 'v3', credentials=creds)

def create_folder_in_drive(service, folder_name, parent_id=None):
    """Create a folder in Google Drive"""
    file_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder'
    }
    
    if parent_id:
        file_metadata['parents'] = [parent_id]
    
    folder = service.files().create(body=file_metadata, fields='id').execute()
    return folder.get('id')

def upload_file_to_drive(service, file_path, folder_id=None):
    """Upload a file to Google Drive and return shareable link"""
    file_metadata = {'name': Path(file_path).name}
    
    if folder_id:
        file_metadata['parents'] = [folder_id]
    
    # Detect MIME type
    mime_types = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    
    extension = Path(file_path).suffix.lower()
    mime_type = mime_types.get(extension, 'application/octet-stream')
    
    media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)
    
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, webViewLink'
    ).execute()
    
    # Make file publicly accessible
    permission = {
        'type': 'anyone',
        'role': 'reader'
    }
    service.permissions().create(
        fileId=file.get('id'),
        body=permission
    ).execute()
    
    return file.get('webViewLink')

def bulk_upload_folder(local_folder_path, drive_folder_name="VJIT Study Materials"):
    """Upload entire folder to Google Drive and generate links"""
    
    print("\n" + "="*80)
    print("🚀 Starting bulk upload to Google Drive")
    print("="*80 + "\n")
    
    # Authenticate
    print("🔐 Authenticating with Google Drive...")
    service = authenticate_google_drive()
    print("✅ Authenticated successfully!\n")
    
    # Create main folder in Drive
    print(f"📁 Creating folder: {drive_folder_name}")
    main_folder_id = create_folder_in_drive(service, drive_folder_name)
    print(f"✅ Folder created: {main_folder_id}\n")
    
    # Get all files
    supported_extensions = {'.pdf', '.doc', '.docx', '.ppt', '.pptx'}
    files_to_upload = []
    
    for file in os.listdir(local_folder_path):
        file_path = os.path.join(local_folder_path, file)
        if os.path.isfile(file_path) and Path(file).suffix.lower() in supported_extensions:
            files_to_upload.append(file_path)
    
    if not files_to_upload:
        print("❌ No files to upload")
        return
    
    print(f"📤 Uploading {len(files_to_upload)} files...\n")
    
    # Upload files and collect links
    uploaded_files = []
    
    for idx, file_path in enumerate(files_to_upload, 1):
        filename = Path(file_path).name
        print(f"[{idx}/{len(files_to_upload)}] Uploading: {filename}...", end=" ")
        
        try:
            link = upload_file_to_drive(service, file_path, main_folder_id)
            uploaded_files.append((filename, link))
            print("✅")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Generate output
    print("\n" + "="*80)
    print("✅ UPLOAD COMPLETE!")
    print("="*80 + "\n")
    print("📋 Copy these links:\n")
    
    for filename, link in uploaded_files:
        print(f"{filename}")
        print(f"  → {link}\n")
    
    print("="*80)
    print("\n💡 Now you can use scan_materials.py to generate the content template!")
    print("="*80 + "\n")

# Example usage
if __name__ == "__main__":
    # CONFIGURE THIS
    local_folder = r"C:\Users\YourName\Documents\PS"
    drive_folder_name = "PS - Probability and Statistics"
    
    bulk_upload_folder(local_folder, drive_folder_name)
