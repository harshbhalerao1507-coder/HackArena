import Student from "../models/Student.js";
import User from "../models/User.js";

export const getStudentProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const student = await Student.findOne({
            user: userId
        });

        const profile = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        if (student) {
            profile.studentId = student._id;
            profile.education = student.education;
            profile.address = student.address;
            profile.college = student.college;
            profile.skills = student.skills;
        }

        res.status(200).json(profile);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


export const updateStudentProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            name,
            phone,
            education,
            address,
            college,
            skills
        } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (phone !== undefined) {
            user.phone = phone;
        }

        await user.save();

        const student = await Student.findOne({
            user: userId
        });

        if (student) {
            if (education !== undefined) {
                student.education = education;
            }

            if (address !== undefined) {
                student.address = address;
            }

            if (college !== undefined) {
                student.college = college;
            }

            if (skills !== undefined) {
                student.skills = skills;
            }

            await student.save();
        }

        const updatedProfile = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        if (student) {
            updatedProfile.studentId = student._id;
            updatedProfile.education = student.education;
            updatedProfile.address = student.address;
            updatedProfile.college = student.college;
            updatedProfile.skills = student.skills;
        }

        res.status(200).json(updatedProfile);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};