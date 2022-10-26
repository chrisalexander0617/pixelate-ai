import './App.css';
import React, {useState} from 'react'
import {Box, Container, Paper,Typography, TextField, LinearProgress} from '@mui/material';
import { OutlinedInput, Button } from '@mui/material';
// const API_KEY  = '9cs8bij9HASMl0zMgco73CFOSUROrP8f'
// const myHeaders = new Headers();
// myHeaders.append("apikey", "9cs8bij9HASMl0zMgco73CFOSUROrP8f");
// fetch("https://api.apilayer.com/face_pixelizer/url?url={url}", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
import { Upload } from "upload-js";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CircularProgress from '@mui/material/CircularProgress';
import { saveAs } from 'file-saver';
var FileSaver = require('file-saver');

const upload = Upload({ apiKey: "free" })
const myHeaders = new Headers();

myHeaders.append("apikey", process.env.REACT_APP_PIXEL_API);

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

function App() {
  const [percentage, setPercentage] = useState(0)
  const [result, setResult] = useState('')
  const [image, setImage] = useState(null)
  const [loading, isLoading] = useState(false)

  const styles = {
    Container: {
      height:'100vh',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'column',
      gap:5
    },
    FlexBox:{
      display:'flex',
      flexDirection:'column',
      gap:2,
      padding:5
    },
    ImageUpload:{
      fontSize:'1em',
      color:'white'
    },
    ImageConatiner:{ 
      display:'flex', 
      alignItems:'center', 
      justfiyContent:'center'
    },
    ResponsiveImage:{
      margin:'0 auto', 
      height:'600px', 
      width:'autp',
      objectFit:'contain',
      display:{ xs:'none', lg:'block' }
    }
  }

  const onChangeHandler = async (event) => {
    isLoading(true)
    const [ file ]    = event.target.files;
    const { fileUrl } = await upload.uploadFile(
      file,
      {
        onBegin:({ cancel })   => console.log("File upload started!"),
        onProgress: ({ progress }) => {
          console.log(`File uploading... ${progress}%`)
          setPercentage(progress)
        }
      }
    );
    fetch(`https://api.apilayer.com/face_pixelizer/url?url=${fileUrl}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      const obj = JSON.parse(result)
      if(obj.result.includes('https://')) {
        setImage(obj.result)
        FileSaver.saveAs(image, "image.jpg");
        setTimeout(() => {
          isLoading(false)
        }, 1000)
      }
    })
    .catch(error => console.error('an error', error), isLoading(false) );
  }

  return (
    <Container sx={styles.Container}>
      {image && (
        <Box 
            sx={styles.ResponsiveImage}
            component="img" 
            src={image}
            width="100%"
            height="100%"
        />
      )}
      <Paper sx={styles.FlexBox} elevation={0}>
        <OutlinedInput onChange={onChangeHandler} style={styles.ImageUpload} type="file"/>
        <LinearProgress sx={{height:'10px', borderRadius:'30px'}} variant="determinate" value={percentage} />
        <Button 
          sx={{fontSize:'1.2em'}} 
          size="large" startIcon={loading ? <CircularProgress /> : <UploadFileIcon />} 
          disabled={loading ? true : false}
          onClick={onChangeHandler} 
          variant="contained"
        >Upload</Button>
        <Typography variant="body1" component="div">{result}</Typography>
        <code>Developed by Digyt.co</code>
      </Paper>
    </Container>
  );
}

export default App;
