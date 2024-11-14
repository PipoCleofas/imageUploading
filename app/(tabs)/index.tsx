import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { useState } from 'react';
import { Button, Image, View } from 'react-native';

export default function UploadImage() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  // Function to capture an image using the camera
  const captureImage = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
      }
    } else {
      alert('Camera permission is required to use the camera');
    }
  };

  // Function to upload the image
  const uploadImage = async () => {
    console.log('Uploading image')
    if (!imageUri) {
      alert('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('photo', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust based on your file type
      name: 'photo.jpg',
    } as any); // Cast to `any` to bypass TypeScript FormData type issues

    try {
      const response = await axios.post('http://192.168.100.127:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
    }
    console.log('Uploaded image')
  };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Button title="Pick an image" onPress={pickImage} />
      <Button title="Capture an image" onPress={captureImage} />
      <Button title="Upload Image" onPress={uploadImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}
