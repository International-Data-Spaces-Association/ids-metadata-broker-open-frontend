# React-based Broker Search Frontend

## Development
- Run the other supporting components in the background. See `../docker/composefiles/frontend-dev`
- Install dependencies: `npm install`
- Run the development server: `npm run start`
- For the local Development Mode, open url-config.js and uncomment the Development Option for the    elasticsearchURL

## Deployment
- make sure that you are using the Deployment Option in the `url-config.js` File for the elasticsearchURL
- Create a build Folder: `npm run build`
- Create a Docker Image: `docker build *NameofImage*`
- Optional: tag and push your image to a Registry: `docker tag`/ `docker push`

## Tenant
currently, there are 2 themes fully implemented:
- eis: the `Fraunhofer IAIS.EIS` Version with a blue design
- mobids: the customized Version for the `Mobility Data Space`

you can switch easily between these designs by changing the `tenant` here:
- `App.jsx`
- `SearchMDMResources.jsx`

## Redux

Three states are stored in redux:

- ```json
  auth: {
      token: string,
      isAuthenticated: boolean,
      isLoading: boolean,
      user: object
  }
  ```

- ```json
  error: {
      msg: object,
      status: number,
      id: string
  }
  ```

- ```json
  user: {
      users: [object],
      loading: boolean,
      userAdded: boolean
  }
  ```

**auth** is for the login and logout handling. *token* will be stored in the cache. If the current user is authenticated, *isAuthenticated* will be true and *user* will be the current user.

**error** is for all kinds of errors happened during the backend requests.

**user** is only used in admin page to load all users from the database. *userAdded* is used to close the drop-down after user is added.

# User Guide

The operational user guide will introduce all possible modes of operations in different components with different user roles.

## User Roles

There are in total three kinds of users:

- Anonymous user:  The user who is logged-in.
- Standard user: The user who has logged in with a user role of "standard".
- Admin user: The user who has logged in and has admin rights.

## Functional Components

### Login & Logout (Header)

- For the anonymous user, only login function is possible. There will be a pop up asking for username and password to log in. If credentials are correct, the user will be logged in as either standard user or admin user. There will be certain warnings if the credentials are incorrect. "Network Error"  if the handler doesn't not work. "Wrong password" if the password incorrect. "User not exist" if there is no such username registered.
- For the standard user and admin user, it would be only logout function available as they have already logged in.

### Dashboard (Sidebar)

Currently use mock-up data to present a dashboard page.

Available for all users.

### Connectors (Sidebar)

The connectors page will show all registered connectors (using reactivesearch). For searching a specific connector, you can filter it for specific Keywords, Publisher or Connector Security Profile. In the registered connector page, the metadata information will be displayed.

Available for all users.

### Resources (Sidebar)

The resources page will show all registered resources (using reactivesearch). For searching a specific resource, you can filter it for Data Publisher, Data Owner or Keywords. In the registered resource page, the metadata information will be displayed.

Available for all users.

### Usage Control (Sidebar)

The usage control page will show different usage control options. After selecting the option, the Sparql query template will show up. Currently, the update function is not working.

Available for admin and standard users.

### Admin (Sidebar)

The admin page will show the details of all registered users in broker. The admin has the following actions:

- Add new user
- Update registered user info
- Delete user

Available only for admin user.

### Maintainer (Sidebar)

The maintainer page will show a list of connector options together with the Sparql query. The user can execute the query to the broker.

Available only for admin user.
