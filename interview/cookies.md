# cookie 的作用域
Cookie是一小段文本信息，伴随着用户请求在 Web 服务器和浏览器之间传递。它存储于访问者的计算机中，每当同一台计算机通过浏览器请求某个页面时，就会发送这个 cookie。

cookie是存于用户硬盘的一个文件，这个文件通常对应于一个域名，也就是说，cookie可以跨越一个域名下的多个网页，但不能跨越多个域名使用。

cookie 将信息存储于用户硬盘，因此可以作为全局变量，这是它最大的一个优点。它最根本的用途是 Cookie 能够帮助 Web 站点保存有关访问者的信息。

## Cookie的属性

- domain字段为可以访问此cookie的域名，告诉浏览器当前要添加的Cookie的域名归属，如果没有明确指明则默认为当前域名，可以设置当前域名或者（父域名必须以“.”开始，例如.xxx.com）。为了保证安全性，cookie无法设置除当前域名或者其父域名之外的其他domain。
- path字段为可以访问此cookie的页面路径。如果没有明确指明则默认为当前路径，比如通过访问。 比如domain是abc.com,path是/test，那么只有/test路径下的页面可以读取此cookie，"/"表示根路径。

| 类型 | domain | path |
| :-----:| :----: | :----: |
| Cookie1 | `.test.com`	| /
| Cookie2 | `www.test.com` | /test/
| Cookie3 | `aa.test.com` | /
| Cookie4 | `www.test.com` | /

当访问www.test.com时
Cookie1 可以提交、
Cookie2 不可以提交，path不一样、
Cookie3 不可以提交，aa.test.com不是www.test.com的父域名、
Cookie4 可以提交