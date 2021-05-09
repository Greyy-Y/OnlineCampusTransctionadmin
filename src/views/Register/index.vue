<template>
  <div class="container-wrapper">
    <div class="container" ref="container">
      <div class="app front">
        <div class="header">
          <span class="info">注 册</span>
          <div class="prompt">
            <span class="ask">已经有账号?</span>
            <button class="btn signup" @click="jumpToLogin">登录</button>
          </div>
        </div>
        <div class="main">
          <div class="user_field">
            <form class="_details">
              <div class="textbox">
                <input type="text" v-model="user_email" />
                <span class="input_detail">邮箱</span>
                <span v-if="!this.user_email" class="validate"></span>
                <span v-else-if="validateEmail" class="validate"
                  >邮箱格式不正确</span
                >
              </div>
              <!-- <div class="textbox" v-if="validateEmail">邮箱格式不正确</div> -->
              <div class="textbox">
                <input type="password" v-model="user_password" />
                <span class="input_detail">密码</span>
                <span class="validate" v-if="includeChinese1"
                  >密码不能包含中文字符</span
                >
                <span
                  class="validate"
                  v-else-if="user_password.length === 0"
                ></span>
                <span
                  class="validate"
                  v-else-if="
                    user_password.length < 6 || user_password.length > 21
                  "
                >
                  密码长度必须大于6小于20位
                </span>
              </div>
              <div class="textbox">
                <input type="password" v-model="user_password1" />
                <span class="input_detail">重复密码</span>
              </div>
            </form>
          </div>
          <div>
            <button class="btn login" @click="handleRegister">注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Register } from "@/api/admin";
export default {
  name: "register",
  data() {
    return {
      user_email: "",
      user_password: "",
      user_password1: ""
    };
  },
  methods: {
    jumpToLogin() {
      this.$router.push("/login");
    },
    handleRegister() {
      if (this.user_email.length === 0 || this.user_password.length === 0) {
        this.$message({
          message: "用户名和密码不能为空！",
          type: "warning"
        });
      } else if (this.user_password != this.user_password1) {
        this.$message({
          message: "密码必须一致",
          typ: "warning"
        });
      } else {
        Register({
          email: this.user_email,
          password: this.user_password
        }).then(res => {
          if (res.data.status === 201) {
            this.$message({
              type: "success",
              message: "注册成功！"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
            return;
          }
        });
      }
    }
  },
  computed: {
    includeChinese1() {
      return /[\u4e00-\u9fa5]+/.test(this.user_password);
    },
    validateEmail() {
      let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      return !reg.test(this.user_email) ? true : false;
    }
  }
};
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.validate {
  color: #2a9d8f;
  font-size: 12px;
}

.container-wrapper {
  width: 100%;
  height: 95vh;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1800px;
  overflow: hidden;
  transform-style: preserve-3d;
  background: rgb(224, 224, 224);
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 800ms ease;
  transform-style: preserve-3d;
  &.active {
    transform: rotateY(180deg);
  }
}

.app {
  width: 550px;
  height: 500px;
  background: #34495e;
  color: #fff;
  font-family: montserrat;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 80px 1fr;
  overflow: hidden;
  backface-visibility: hidden;
  position: absolute;
  box-shadow: -2px 5px 15px rgba(0, 0, 0, 0.35);
  &.front {
    transform: rotateY(0deg) translateZ(0em);
  }
  &.back {
    transform: rotateY(180deg) translateZ(0.5px);
  }
}

.btn {
  height: 50px;
  outline: none;
  border: none;
  cursor: pointer;
  background: #2a9d8f;
  letter-spacing: 1px;
  font-size: 18px;
}

.header {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 150px 1fr;
  background: #2c3e50;
  padding: 0 20px;

  .info {
    height: 100%;
    font-weight: 800;
    font-size: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 2px;
  }
  .prompt {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    margin-right: 20px;
    .btn {
      padding: 0 20px;
      margin-left: 20px;
      color: #fff;
      font-size: 1.1rem;
    }
    .btn:hover {
      opacity: 0.8;
    }
  }
}

.main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  .user_field {
    width: 92%;
    height: 100%;
    background: rgba(44, 62, 80, 0.6);
    padding: 10px 30px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    .option_text {
      font-size: 15px;
      margin: 5px 0 10px 0;
    }
    ._details {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .textbox {
        position: relative;
        margin: 10px 0 20px 0;
        height: 60px;
        display: flex;
        align-items: center;
        input {
          position: relative;
          height: 40px;
          width: 80%;
          border: none;
          background: none;
          border-bottom: 2px solid #fff;
          font-size: 20px;
          color: #fff;
          padding: 0 10px;
          letter-spacing: 1px;
          outline: none;
          &:focus {
            & + .input_detail {
              font-size: 18px;
              left: 10px;
              top: 15%;
              color: #2a9d8f;
              opacity: 0.9;
            }
          }
        }
        .input_detail {
          position: absolute;
          left: 10px;
          top: 50%;
          font-size: 24px;
          transform: translateY(-50%);
          pointer-events: none;
          user-select: none;
          font-weight: 800;
          opacity: 0.1;
          transition: all 200ms ease;
        }
      }
    }
  }
  .btn.login {
    position: relative;
    color: #fff;
    align-self: flex-end;
    margin: 20px 20px 0 0;
    padding: 10px 0;
    width: 160px;
    font-size: 1.5rem;
  }
  .btn.login:hover {
    opacity: 0.8;
  }
}
a {
  margin: 0 20px;
  color: #fff;
  font-size: 2rem;
  transition: all 400ms ease;
}

a:hover {
  color: #222;
}
</style>
