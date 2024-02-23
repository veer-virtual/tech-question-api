## Run setup
Step 1: First Execute the command `npm i or npm install`

## Run server

Step 2: run the server by command  `npm run dev` it will run `http:://localhost:3000`

## Storage and Collection Firebase

Bucket: `gs://fileuploaddemo-a176e.appspot.com`

Collection : `fileUploadDetails`

---------------------------------------------------------------------------------
## Tech Question 1 (API)
Question 1: ( compulsory )
Create a file upload feature in Angular that accepts any image or video files, less than 10
MB and upload the file to the firebase storage.
Add some some interactions or animations like upload progress and file upload status
Add a preview of the file that has been uploaded.
Place appropriate validations and error messages wherever required

## URL to get all uploaded files 
Method : GET

http://3.110.122.52:3000/api/getUploadedFiles

## URL to upload file on firebase
Params (form-data):  
file

Method : POST

http://3.110.122.52:3000/api/upload