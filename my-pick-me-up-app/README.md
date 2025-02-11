# My Pick-Me-Up App

## Overview
My Pick-Me-Up App is a mobile application that allows users to create, view, and manage items. Users can log in, create accounts, and interact with various items through a consistent and unified design system.

## Features
- User Authentication: Log in and create accounts.
- Item Management: Create, view, and manage items.
- Global Styling: Consistent design across all screens.
- Google Places Integration: Search for addresses using Google Places API.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/cornetto9/pick-me-up-frontend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd my-pick-me-up-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Screens

### Account
This screen displays the user's account information and their posted items.

- **File**: [app/Account.js](../app/Account.js)
- **Usage**:
  ```javascript
  import Account from '../app/Account';

  <Account />
  ```

### CreateItem
This screen allows users to create a new item.

- **File**: [app/CreateItem.js](../app/CreateItem.js)
- **Usage**:
  ```javascript
  import CreateItem from '../app/CreateItem';

  <CreateItem />
  ```

### CreateUser
This screen allows users to create a new account.

- **File**: [app/CreateUser.js](../app/CreateUser.js)
- **Usage**:
  ```javascript
  import CreateUser from '../app/CreateUser';

  <CreateUser />
  ```

### Home
This screen displays a list of items.

- **File**: [app/Home.js](../app/Home.js)
- **Usage**:
  ```javascript
  import Home from '../app/Home';

  <Home />
  ```

### ItemDetails
This screen displays the details of a specific item.

- **File**: [app/ItemDetails.js](../app/ItemDetails.js)
- **Usage**:
  ```javascript
  import ItemDetails from '../app/ItemDetails';

  <ItemDetails />
  ```

### Login
This screen allows users to log in to their account.

- **File**: [app/Login.js](../app/Login.js)
- **Usage**:
  ```javascript
  import Login from '../app/Login';

  <Login />
  ```

### UserInfo
This screen displays the user's information and allows them to update it.

- **File**: [app/UserInfo.js](../app/UserInfo.js)
- **Usage**:
  ```javascript
  import UserInfo from '../app/UserInfo';

  <UserInfo />
  ```

## Components

### GooglePlacesInput
This component is used to search for addresses using Google Places API.

- **File**: [src/components/GooglePlacesInput.js](../src/components/GooglePlacesInput.js)
- **Usage**:
  ```javascript
  import GooglePlacesInput from '../src/components/GooglePlacesInput';

  <GooglePlacesInput onAddressSelected={handleAddressSelect} />
  ```

### BottomNav
This component provides a bottom navigation bar for navigating between different screens.

- **File**: [src/components/BottomNav.js](../src/components/BottomNav.js)
- **Usage**:
  ```javascript
  import BottomNav from '../src/components/BottomNav';

  <BottomNav />
  ```


## Global Styling
The project now uses a **global styling system** (`styles.js`) to maintain consistency across screens. All buttons, inputs, and layout components follow a unified design.

### How to Use:
- Import the global styles:  
  ```javascript
  import styles from '../src/styles';
  ```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.