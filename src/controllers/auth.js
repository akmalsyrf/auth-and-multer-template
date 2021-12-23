// import model here
const { user } = require("../../models");

// import package here
const Joi = require("joi");

exports.register = async (req, res) => {
  // code here
  const data = req.body;
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().required(),
    status: Joi.string().required(),
  });
  const { error } = schema.validate(data);

  if (error) {
    return res.send({
      status: "error",
      message: error.details[0].message,
    });
  }
  try {
    const newUser = await user.create({
      name: data.name,
      email: data.email,
      password: data.password,
      status: data.status,
    });
    res.send({
      status: "success",
      data: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.login = async (req, res) => {
  // code here
  const data = req.body;
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate(data);

  if (error) {
    return res.send({
      status: "error",
      message: error.details[0].message,
    });
  }
  try {
    const userExist = await user.findOne({
      where: { email: data.email, password: data.password },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!userExist) {
      return res.status(400).send({
        status: "failed",
        message: "email or password doesn't exist",
      });
    }
    res.send({
      status: "success",
      data: { name: userExist.name, email: userExist.email },
    });
  } catch (error) {
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};
