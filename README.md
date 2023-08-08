# WeaveSync

WeaveSync is an Arweave block indexer equipped with a REST API. It's designed to index blocks from the Arweave network and provide an interface to interact with the indexed data.

## Features

- Indexes Arweave blocks for easy access and manipulation.
- Provides a REST API to interact with the indexed data.
- Uses PM2 for process management.
- Stores indexed data in a SQLite database.

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine. If not, download and install it from [Node.js official website](https://nodejs.org/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mhmulford0/weavesync.git
   ```

2. Navigate to the project directory:

   ```bash
   cd weavesync
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

### Usage

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the project:

   ```bash
   npm start
   ```

3. To set up the database:

   ```bash
   npm run setupDb
   ```

4. For development:

   ```bash
   npm run dev
   ```

5. To start the API:

   ```bash
   npm run start:api
   ```

6. To start the indexer:
   ```bash
   npm run start:indexer
   ```

## License

This project is licensed under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/mhmulford0/weavesync/issues) for open issues or create a new one.
