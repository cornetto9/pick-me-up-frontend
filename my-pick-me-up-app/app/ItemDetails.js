import React, { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet, Image, Platform,
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal, TouchableOpacity, ScrollView
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import moment from 'moment-timezone'; // Import moment-timezone for time conversion

const API_URL = Constants.expoConfig.extra.API_URL;

const ItemDetails = () => {
  const params = useLocalSearchParams();
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [postingComment, setPostingComment] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(''); // State to store username
  const [expandedView, setExpandedView] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false); // State to show/hide comment input
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (item || !params || !params.item_id) return;

    setItem({
      title: params.title || "No Title Available",
      details: params.details || "No Details Available",
      image_url: params.image_url || null,
      latitude: params.latitude ? parseFloat(params.latitude) : 37.7749,
      longitude: params.longitude ? parseFloat(params.longitude) : -122.4194,
      item_id: parseInt(params.item_id, 10),
      created_at: params.created_at || new Date().toISOString(),
      status: params.status || "Unknown",
    });

    setLoading(false);
  }, [params]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        const storedUsername = await AsyncStorage.getItem('username'); // Fetch username from AsyncStorage
        if (storedUserId) setUserId(parseInt(storedUserId, 10));
        if (storedUsername) setUsername(storedUsername); // Set username state
      } catch (error) {
        console.error("❌ Error fetching user_id or username from AsyncStorage:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!item?.item_id) return;
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}/comments?item_id=${item.item_id}`, { timeout: 10000 });
        setComments(Array.isArray(response.data.comment) ? response.data.comment : []);
      } catch (error) {
        console.error('❌ Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [item?.item_id]);

  const handlePostComment = async () => {
    if (!commentText.trim() || userId === null || !item?.item_id) {
      console.warn("⚠️ Cannot post comment. Missing data.");
      return;
    }

    try {
      setPostingComment(true);
      const response = await axios.post(`${API_URL}/comments`, {
        comment_text: commentText,
        user_id: userId,
        item_id: item.item_id,
        username: username, // Include username in the comment
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setCommentText('');
      setComments((prevComments) => [...prevComments, response.data.comment]);
    } catch (error) {
      console.error('❌ Error posting comment:', error);
    } finally {
      setPostingComment(false);
      setShowCommentInput(false); // Hide comment input after posting
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (!item) return <Text style={styles.errorText}>Error loading item details.</Text>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDetails}>{item.details}</Text>
            <Text style={styles.itemCreated}>Created: {moment(item.created_at).tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss')}</Text>
            <Text style={styles.itemStatus}>Status: {item.status}</Text>

            {/* Clickable Image */}
            {item.image_url ? (
              <TouchableOpacity onPress={() => setExpandedView('image')}>
                <Image source={{ uri: item.image_url }} style={styles.itemThumbnail} />
              </TouchableOpacity>
            ) : (
              <Text>No Image Available</Text>
            )}

            {/* Clickable Map */}
            {Platform.OS !== 'web' ? (
              <TouchableOpacity onPress={() => setExpandedView('map')}>
                <MapView
                  style={styles.mapThumbnail}
                  initialRegion={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                >
                  <Marker coordinate={{ latitude: item.latitude, longitude: item.longitude }} />
                </MapView>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noMapText}>Map not available on web</Text>
            )}

            {/* Comments Section */}
            {comments.map((comment) => (
              <View key={comment.comment_id} style={styles.commentContainer}>
                <Text style={styles.commentText}>
                  <Text style={styles.username}>@{comment.username} </Text> {/* Display username in bold */}
                  {comment.comment_text}
                </Text>
                <Text style={styles.commentDate}>
                  {moment(comment.created_at).tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss')} {/* Convert to Pacific Time */}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Floating Scroll to Top Button */}
          <TouchableOpacity
            style={styles.scrollToTopButton}
            onPress={() => scrollViewRef.current.scrollTo({ y: 0, animated: true })}
          >
            <Ionicons name="arrow-up" size={24} color="white" />
          </TouchableOpacity>

          {/* Floating Comment Button */}
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => setShowCommentInput(true)}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="white" />
          </TouchableOpacity>

          {/* Fixed Comment Input & Button */}
          {showCommentInput && (
            <View style={styles.commentBox}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity style={styles.postButton} onPress={handlePostComment} disabled={postingComment}>
                <Ionicons name="send" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowCommentInput(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Expanded View Modal */}
          <Modal visible={!!expandedView} transparent={true} animationType="fade">
            <TouchableOpacity style={styles.modalContainer} onPress={() => setExpandedView(null)}>
              <View style={styles.modalContent}>
                {expandedView === 'image' && item.image_url && (
                  <Image source={{ uri: item.image_url }} style={styles.fullScreenImage} />
                )}
                {expandedView === 'map' && (
                  <MapView
                    style={styles.fullScreenMap}
                    initialRegion={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker coordinate={{ latitude: item.latitude, longitude: item.longitude }} />
                  </MapView>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

/** ✅ Fix UI Issues **/
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'lightblue' },
  innerContainer: { flex: 1, padding: 20 },
  scrollViewContent: { paddingBottom: 80 },
  itemTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  itemDetails: { fontSize: 18, textAlign: 'center', marginBottom: 10, width: '100%' },
  itemThumbnail: { width: 300, height: 200, borderRadius: 10, marginBottom: 10, alignSelf: 'center' },
  mapThumbnail: { width: 300, height: 200, marginBottom: 10, alignSelf: 'center' },
  commentsList: { paddingBottom: 80 },
  commentBox: { 
    position: 'absolute', 
    bottom: 80, 
    left: 10, 
    right: 10, 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 10, 
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', height: '90%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: '90%', height: '90%', resizeMode: 'contain' },
  fullScreenMap: { width: '90%', height: '90%' },
  commentContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'},
  commentText: { fontSize: 16 },
  username: { fontWeight: 'bold' }, // Style for username
  commentDate: { fontSize: 12, color: '#888' },
  commentInput: { 
    height: 40,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  scrollToTopButton: { 
    position: 'absolute', 
    top: 20, 
    right: 20, 
    backgroundColor: '#007bff', 
    borderRadius: 50, 
    padding: 10 
  },
  commentButton: { 
    position: 'absolute', 
    bottom: 20, 
    right: 20, 
    backgroundColor: '#007bff', 
    borderRadius: 50, 
    padding: 10 
  },
  closeButton: {
    marginLeft: 10,
    backgroundColor: '#ff0000',
    borderRadius: 5,
    padding: 5,
  },
  postButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 5,
  },
});

export default ItemDetails;
