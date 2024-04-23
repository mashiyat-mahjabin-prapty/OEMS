// controller for admin profile page

const Admin = require('../../models/admin');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
    try{ 
        console.log('req', req.jwt.admin_id);
        const admin = await Admin.findByPk(req.jwt.admin_id);
        console.log(admin);
        res.json(admin).status(200);
    } catch (err) {
        console.error('Error in getProfile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { Name, email, password } = req.body;
        console.log('req', req.jwt.admin_id);
        const admin = await Admin.findByPk(req.jwt.admin_id);
        console.log(admin);

        // check if the given email matches with someone else and not with himself
        const adminWithEmail = await Admin.findOne({
            where: { email },
        });
        if (adminWithEmail && adminWithEmail.admin_id !== admin.admin_id) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);
        
        admin.Name = Name;
        admin.email = email;
        admin.password = encryptedPassword;
        await admin.save();

        res.json(admin).status(200);
    } catch (err) {
        console.error('Error in updateProfile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
