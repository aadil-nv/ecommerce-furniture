const isLogin = async (req, res, next) => {
    try {
         if (req.session.user) {
           next()
        }
        else {
            res.redirect('/registration')
        }

    } catch (erorr) {
        console.log(erorr.message)
    }
}

const isLogout = async (req, res, next) => {
    try {
         if (!req.session.user) {
            
             next()
        } else {
            res.redirect('/')
        }

    } catch (erorr) {
        console.log(erorr.message)
    }
}

module.exports = {
    isLogin,
    isLogout
}