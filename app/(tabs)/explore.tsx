import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

export default function DisplayImages() {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://192.168.100.127:3000/images');

                // Directly use the base64-encoded data from server
                const base64Images = response.data.map((item: { image_data: string }) =>
                    `data:image/jpeg;base64,${item.image_data}`
                );
                setImages(base64Images);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {images.length > 0 ? (
                images.map((imageData, index) => (
                    <Image key={index} source={{ uri: imageData }} style={styles.image} />
                ))
            ) : (
                <Text>No images available</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 10,
    },
});
