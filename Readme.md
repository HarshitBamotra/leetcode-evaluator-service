# User Code Evaluation

1. **Client Submits the code**
    - Feed code to docker container (string)
2. **Code will run inside the container and produce logs (out/err)**
    - read these logs in form of stream
3. **Streams will help us read these logs chunk by chunk in form of Bytes**
    - Process the bytes (Buffer)
4. **With each byte, we will get info whether the byte represents err or out and the value of the byte**
