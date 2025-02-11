import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light Gray background
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6C9BCF', // Soft Blue
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2C3E50', // Midnight Navy
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

itemContainer: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Add shadow for better visibility
  },
  
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#ccc', // Set background to prevent flickering
  },
  
  placeholderImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  placeholderText: {
    fontSize: 14,
    color: 'gray',
  },
  
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
});