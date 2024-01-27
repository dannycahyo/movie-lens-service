FROM alpine/git
RUN mkdir /repo
WORKDIR /repo

# Clone the omdb-postgresql repository from GitHub into a new directory named omdb
RUN git clone --depth=1 https://github.com/credativ/omdb-postgresql omdb

# Start the second stage of the build, using the postgres:14 image as the base
FROM postgres:14

# Copy the /repo directory from the first stage into the current directory of the second stage
# Change the owner of the copied files to the postgres user
COPY --from=0 --chown=postgres:postgres /repo .

WORKDIR /omdb

# Update the package lists, install wget and bzip2, and clean up
RUN apt-get update -y && apt-get install wget bzip2 -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# Run the download script (downloads the OMDB dataset)
RUN ./download

# Copy the import.sh script from the current directory on the host to the /docker-entrypoint-initdb.d/import.sh path in the image
# Scripts in the /docker-entrypoint-initdb.d directory are automatically run when the container starts
COPY ./import.sh /docker-entrypoint-initdb.d/import.sh