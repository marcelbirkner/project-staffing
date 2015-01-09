FROM    tcnksm/centos-ruby
# FROM    centos:centos6

# Enable EPEL for Node.js
# RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm

# Install Ruby, required for sass & compass
# RUN     yum install -y ruby
RUN     gem --version

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install 
EXPOSE  9000

CMD ["node", "/src/server.js"]

