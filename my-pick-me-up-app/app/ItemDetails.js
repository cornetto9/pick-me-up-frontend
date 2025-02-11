import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Modal, TouchableOpacity, ScrollView, LogBox } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import moment from 'moment-timezone'; // Import moment-timezone for time conversion
import { useRoute } from '@react-navigation/native'; // Import useRoute from react-navigation

LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component.',
]);

const API_URL = Constants.expoConfig.extra.API_URL;

const ItemDetails = () => {
  const route = useRoute(); // Use useRoute to get route parameters
  const params = route.params || {};
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [postingComment, setPostingComment] = useState(false);
  const [userId, setUserId] = useState(null);
  const [expandedView, setExpandedView] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(true); // Set to true to show comment input by default
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // State to track keyboard visibility
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error('❌ Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (item || !params || !params.item_id) {
      setLoading(false);
      return;
    }

    console.log("Params:", params);

    setItem({
      title: params.title || "No Title Available",
      details: params.details || "No Details Available",
      image_url: params.image_url || null,
      latitude: params.latitude ? parseFloat(params.latitude) : 37.7749,
      longitude: params.longitude ? parseFloat(params.longitude) : -122.4194,
      status: params.availability === "true" ? "Available" : "Not Available", // Use availability as status
      item_id: parseInt(params.item_id, 10),
      created_at: params.created_at || new Date().toISOString(),
    });
    setLoading(false);
  }, [params]);

  useEffect(() => {
    if (!item?.item_id) return;
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}/comments?item_id=${item.item_id}`, { timeout: 10000 });
        console.log("Fetched Comments:", response.data); // Debugging

        const sortedComments = response.data.comment.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setComments(sortedComments);
      } catch (error) {
        console.error('❌ Error fetching comments:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching comments
      }
    };
    fetchComments();
  }, [item?.item_id]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setCommentText('');
      setComments((prevComments) => [response.data.comment, ...prevComments]); // Prepend the new comment
    } catch (error) {
      console.error('❌ Error posting comment:', error);
    } finally {
      setPostingComment(false);
      // Remove the line below to keep the comment input visible
      // setShowCommentInput(false); 
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!item) {
    return <Text>No item details available</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 80 })}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.innerContainer}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDetails}>{item.details}</Text>
              <Text style={styles.itemStatus}>Status: {item.status}</Text> {/* Ensure status is displayed */}
              <Text style={styles.itemCreated}>
                Created: {moment.utc(item.created_at).tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss')}
              </Text>

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
                </View>
              )}

              {/* Comments Section */}
              {comments.map((comment) => (
                <View key={comment.comment_id} style={styles.commentContainer}>
                  <Text style={styles.commentText}>
                    <Text style={styles.username}>
                      @User ID: {comment.user_id} 
                    </Text>
                    <Text> {comment.comment_text}</Text> {/* Wrap comment text in <Text> */}
                  </Text>
                  <Text style={styles.commentDate}>
                    {moment.utc(comment.created_at).tz('America/Los_Angeles').format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Floating Scroll to Top Button */}
          {!isKeyboardVisible && (
            <TouchableOpacity
              style={styles.scrollToTopButton}
              onPress={() => scrollViewRef.current.scrollTo({ y: 0, animated: true })}
            >
              <Ionicons name="arrow-up" size={24} color="white" />
            </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA' // Light background for a clean look
  },
  innerContainer: { 
    flex: 1, 
    padding: 20 
  },
  scrollViewContent: { 
    paddingBottom: 100 
  },
  itemTitle: { 
    fontSize: 26, 
    fontWeight: 'bold',
    textAlign: 'center', 
    color: '#333', 
    marginBottom: 10 
  },
  itemDetails: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginBottom: 10, 
    color: '#555' 
  },
  itemCreated: { 
    fontSize: 14, 
    textAlign: 'center', 
    color: '#888', 
    marginBottom: 10 
  },
  itemStatus: { 
    fontSize: 16, 
    textAlign: 'center', 
    fontWeight: 'bold', 
    color: 'white', 
    backgroundColor: '#6C9BCF',    
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    alignSelf: 'center',
    marginBottom: 15
  },
  itemThumbnail: { 
    width: '100%', 
    height: 250, 
    borderRadius: 12, 
    marginBottom: 15, 
    alignSelf: 'center',
    resizeMode: 'cover' 
  },
  mapThumbnail: { 
    width: '100%', 
    height: 200, 
    borderRadius: 10, 
    marginBottom: 15, 
    alignSelf: 'center' 
  },
  commentContainer: { 
    padding: 10, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginBottom: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3 
  },
  commentText: { 
    fontSize: 16, 
    color: '#333' 
  },
  username: { 
    fontWeight: 'bold', 
    color: '#007bff'  
  },
  commentDate: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 5 
  },
  scrollToTopButton: { 
    position: 'absolute', 
    bottom: 20,
    right: 20, 
    backgroundColor: '#6C9BCF', 
    borderRadius: 50, 
    padding: 12, 
    elevation: 3 
  },
  commentBox: { 
    position: 'relative', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3, 
    marginBottom: 10,
  },
  commentInput: { 
    flex: 1, 
    height: 40, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    paddingHorizontal: 10, 
    borderRadius: 8, 
    backgroundColor: '#f0f0f0', 
    marginRight: 10,
    fontSize:16,
  },
  postButton: { 
    backgroundColor: '#6C9BCF', 
    borderRadius: 8, 
    padding: 8 
  },
  closeButton: { 
    backgroundColor: '#ff4444', 
    borderRadius: 8, 
    padding: 8, 
    marginLeft: 5 
  },
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '90%', 
    height: '90%', 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 12 
  },
  fullScreenImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain' 
  },
  fullScreenMap: { 
    width: '100%', 
    height: '100%' 
  }
});

export default ItemDetails;