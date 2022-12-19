<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dat-roy/discode">
    <img src="https://github.com/dat-roy/discode/blob/assets/images/logo.png?raw=true" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Discode</h3>

  <p align="center">
    A social networking site for developers.
    <br />
    <a href=""><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <b>
    <a href="https://drive.google.com/drive/folders/1d7FXsUYkdc67q2gSqXH5yPMawXFfe8qg">View Demo</a>
    ·
    <a href="https://github.com/dat-roy/discode/issues">Report Bug</a>
    ·
    <a href="https://github.com/dat-roy/discode/labels/enhancement">Request Feature</a>
    </b>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#technical-stack">Technical Stack</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#database">Database</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

![Discode Landing Page](https://raw.githubusercontent.com/dat-roy/discode/assets/images/intro.png)


### Technical Stack
This project uses a variant of <a href="https://www.mongodb.com/mern-stack">MERN Stack</a>, where MongoDB is replaced by MySQL.

* Client
  
  [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)][React-url]
  [![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)][MUI-url]
  [![Ant-Design](https://img.shields.io/badge/-AntDesign-%230170FE?style=for-the-badge&logo=ant-design&logoColor=white)][Antd-url]
  
* Server

  [![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)][NodeJs-url]
  [![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)][ExpressJs-url]
  [![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)][SocketIo-url]
  
* Database
  
  [![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)][MySQL-url]



<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features
<details>
<summary><font size="+0">Profile</font></summary>

![Profile page](https://raw.githubusercontent.com/dat-roy/discode/assets/images/profile/profile.png)

</details>

<details>
<summary><font size="+0">Notifications</font></summary>

Here you can see your notification history. There are 2 types of notifications:
* Post notifications (when someone liked or commented on one of your posts).
* Channel notifications (when someone invited you to join a channel, or your request to join was declined).
  
![Notifications Page](https://raw.githubusercontent.com/dat-roy/discode/assets/images/notifications/notifications.png)
  
</details>

<details>
<summary><font size="+0">Private chat</font></summary>

<em>It is a space for private messages, inspired by Messenger of Meta.</em>


Main view:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/chat/chat--first-view.png)

After click any room:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/chat/chat--inner-view.png)

You can send some texts, some emojis or an image:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/chat/chat--input.png)

You can also click on an image to see the preview:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/chat/chat--image-preview.png)

In addition to the above, this feature also shows you the online status of the people you have chatted with, and the status of viewing messages or not <b>in real-time</b>. 

</details>

<details>
<summary><font size="+0">Channel</font></summary>

<em>This feature is inspired by Discord.</em>

    This is a suitable place for people to connect with each other and share useful experiences.

Main view:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--main-view.png)

Click on a channel to see the preview and be able to send a request to join:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--preview.png)

You can search channels by enter a keyword into search bar.<br/>
<em>Toggle highlight</em> will help you to know which results are the most suitable to the keyword.

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--search.png)

If you want to create your own communities, this channel creator will be helpful, within only two easy steps:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--creator-1.png)

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--creator-2.png)

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--creator-3.png)

Inside a channel:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--inner-view.png)

Every members can invite other people to join:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--invite.png)

But only admin can receive people's requests to join and decide whether to approve it or not:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--admin-notifications.png)

And only admin has permission to create rooms:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/channel/channel--create-room.png)


</details>

<details>
<summary><font size="+0">Posts</font></summary>

<em>This feature is inspired by Medium.</em>

    Here you can publish posts/articles to share your knowledge with everyone.

This is the main page where we can view featured posts, authors and topics.

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/post/post--feed.png)

Searching posts:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/post/post--search.png)

Create your own posts:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/post/post--creator.png)

Read a post:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/post/post--view.png)

Comment box:

![](https://raw.githubusercontent.com/dat-roy/discode/assets/images/post/post--comment.png)

</details>
<br/>

> **_NOTE:_** For a visual look, please <a href="https://drive.google.com/drive/folders/1d7FXsUYkdc67q2gSqXH5yPMawXFfe8qg">view demo</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Database

![Database Relational Diagram](https://raw.githubusercontent.com/dat-roy/discode/assets/images/database.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag `enhancement`.
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React-url]: https://reactjs.org/
[MUI-url]: https://mui.com
[Antd-url]: https://ant.design
[NodeJs-url]: https://nodejs.org/en
[ExpressJs-url]: https://expressjs.com/
[SocketIo-url]: https://socket.io
[MySQL-url]: https://mysql.com
