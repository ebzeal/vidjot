if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI : 'mongodb://<dbuser>:<dbpassword>@ds237389.mlab.com:37389/vidjot-prod'}
}else{
    module.exports = {mongoURI : 'mongodb://localhost/vidjot-dev'}
}