const isLogin = async (req, res, next) => {
    try {
         if (req.session.user) {
            res.redirect('/registration')
        }
        else {
            next()
        }

    } catch (erorr) {
        console.log(erorr.message)
    }
}

const isLogout = async (req, res, next) => {
    try {
         if (req.session.user) {
            res.redirect('/')
        } else {
            next()
        }

    } catch (erorr) {
        console.log(erorr.message)
    }
}

module.exports = {
    isLogin,
    isLogout
}