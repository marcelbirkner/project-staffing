FROM    tcnksm/centos-ruby

# Install NodeJS
RUN     yum install -y npm

# Bundle app source
COPY . /opt/project-staffing/

# Install app dependencies
RUN cd /opt/project-staffing/; npm install 
EXPOSE  9000

CMD ["node", "/opt/project-staffing/server.js"]

