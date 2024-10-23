
# Book Swap Platform

This is a decentralized Book Swap Platform built using Azle and the DFINITY Internet Computer. The platform allows users to list books for swap, send and receive swap requests, and provide feedback on completed swaps.

## Features

- **User Management:** Users can create and manage their profiles.
- **Book Management:** Users can list books, update or delete them, and search for books based on title, author, or genre.
- **Swap Requests:** Users can send and manage swap requests for books and accept or reject incoming swap requests.
- **Feedback System:** Users can provide feedback on completed swaps, including ratings and comments.
- **Featured Swappers:** A leaderboard showing the top swappers of the current month, including details of their most recent books.

## Installation

To run this project locally, follow these steps:

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/warrenshiv/Book_Swap_ICP-201-.git
    cd Book_Swap_ICP-201
    ```

2. **Install Dependencies:**
    Install the required dependencies using npm:
    ```bash
    npm install
    ```

3. **Run the Canister:**
    Start the canister:
    ```bash
    dfx start --background --clean
    ```

    Deploy the canisters:
    ```bash
    ./deploy.sh
    ```

4. **Access the Application:**
    Once deployed, you can interact with the canisters through the frontend url or backend url.

## Usage

### Creating a User Profile

To create a user profile, use the `createUserProfile` method. The required fields are `name`, `email`, and `phoneNumber`.

Example:
```javascript
  name: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "1234567890",
```

### Listing a Book

To list a book for swap, use the `listBook` method. Ensure that the `userId` is provided along with the book details.

Example:
```javascript
  userId: "user-uuid",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  genre: "Fiction",
  description: "A classic novel.",
  imageUrl: "https://example.com/gatsby.jpg",
```

### Sending a Swap Request

To send a swap request for a book, use the `createSwapRequest` method. The `ownerId`, `requesterId`, and `bookId` are required.

Example:
```javascript
  ownerId: "owner-uuid",
  requesterId: "requester-uuid",
  bookId: "book-uuid",
```

### Providing Feedback

To provide feedback on a completed swap, use the `createFeedback` method. The `userId`, `swapRequestId`, `rating`, and `comment` are required.

Example:
```javascript
  userId: "user-uuid",
  swapRequestId: "swap-request-uuid",
  rating: 5,
  comment: "Great swap experience!",
```

## API Reference

### User

- **`createUserProfile(UserPayload)`**
- **`updateUserProfile(userId, UserPayload)`**
- **`getUserProfile(userId)`**
- **`getUserProfileByOwner()`**
- **`getTotalUsers()`**

### Book

- **`listBook(BookPayload)`**
- **`updateBook(bookId, BookPayload)`**
- **`getBook(bookId)`**
- **`getBooksByUser(userId)`**
- **`getBooksByGenre(genre)`**
- **`getAllBooks()`**
- **`getTotalBooks()`**

### Swap Request

- **`createSwapRequest(SwapRequestPayload)`**
- **`updateSwapRequest(SwapRequestPayload)`**
- **`getSwapRequest(swapRequestId)`**
- **`getSwapRequestsByUser(userId)`**
- **`getNumberOfPendingSwapRequests(userId)`**
- **`getNumberOfCompletedSwapRequests(userId)`**
- **`getSwapRequestsForUser(userId)`**
- **`getAllSwapRequests()`**
- **`acceptSwapRequest(swapRequestId)`**
- **`rejectSwapRequest(swapRequestId)`**
- **`getTotalCompletedSwapRequests()`**

### Feedback

- **`createFeedback(FeedbackPayload)`**
- **`updateFeedback(FeedbackPayload)`**
- **`getFeedback(feedbackId)`**
- **`getFeedbacksByUser(userId)`**
- **`getAllFeedbacks()`**
- **`getFeedbacksBySwapRequest(swapRequestId)`**
- **`deleteFeedback(feedbackId)`**

### Featured Swappers

- **`getFeaturedSwappers()`**


## Things to be explained in the course:
1. What is Ledger? More details here: https://internetcomputer.org/docs/current/developer-docs/integrations/ledger/
2. What is Internet Identity? More details here: https://internetcomputer.org/internet-identity
3. What is Principal, Identity, Address? https://internetcomputer.org/internet-identity | https://yumimarketplace.medium.com/whats-the-difference-between-principal-id-and-account-id-3c908afdc1f9
4. Canister-to-canister communication and how multi-canister development is done? https://medium.com/icp-league/explore-backend-multi-canister-development-on-ic-680064b06320

## How to deploy canisters implemented in the course

### Ledger canister
`./deploy-local-ledger.sh` - deploys a local Ledger canister. IC works differently when run locally so there is no default network token available and you have to deploy it yourself. Remember that it's not a token like ERC-20 in Ethereum, it's a native token for ICP, just deployed separately.
This canister is described in the `dfx.json`:
```
	"ledger_canister": {
  	"type": "custom",
  	"candid": "https://raw.githubusercontent.com/dfinity/ic/928caf66c35627efe407006230beee60ad38f090/rs/rosetta-api/icp_ledger/ledger.did",
  	"wasm": "https://download.dfinity.systems/ic/928caf66c35627efe407006230beee60ad38f090/canisters/ledger-canister.wasm.gz",
  	"remote": {
    	"id": {
      	"ic": "ryjl3-tyaaa-aaaaa-aaaba-cai"
    	}
  	}
	}
```
`remote.id.ic` - that is the principal of the Ledger canister and it will be available by this principal when you work with the ledger.

Also, in the scope of this script, a minter identity is created which can be used for minting tokens
for the testing purposes.
Additionally, the default identity is pre-populated with 1000_000_000_000 e8s which is equal to 10_000 * 10**8 ICP.
The decimals value for ICP is 10**8.

List identities:
`dfx identity list`

Switch to the minter identity:
`dfx identity use minter`

Transfer ICP:
`dfx ledger transfer <ADDRESS>  --memo 0 --icp 100 --fee 0`
where:
 - `--memo` is some correlation id that can be set to identify some particular transactions (we use that in the marketplace canister).
 - `--icp` is the transfer amount
 - `--fee` is the transaction fee. In this case it's 0 because we make this transfer as the minter idenity thus this transaction is of type MINT, not TRANSFER.
 - `<ADDRESS>` is the address of the recipient. To get the address from the principal, you can use the helper function from the marketplace canister - `getAddressFromPrincipal(principal: Principal)`, it can be called via the Candid UI.


### Internet identity canister

`dfx deploy internet_identity` - that is the canister that handles the authentication flow. Once it's deployed, the `js-agent` library will be talking to it to register identities. There is UI that acts as a wallet where you can select existing identities
or create a new one.


