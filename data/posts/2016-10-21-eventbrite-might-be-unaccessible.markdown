# Eventbrite might be unaccessible right before the conference due to a major DDoS attack against DNS infrastructure

Due to a network attack you may not be able to access Eventbrite right now.
Check if any of your friends or colleagues can see Eventbrite (the outage affects various access providers differently:
you may have COMCAST and you don't see the site but your cellular provider can connect to it and you can sign up with your phone. Or the other way around).
If you have various ways to connect to the internet check all of them. If you cannot find access in any way to buy the tickets, contact us.
We'll also have some tickets reserved for walk-ins tomorrow.

![T-shirt](/images/posts/level-3-outage-map-2016-10-21.png)
[Check current outage map](http://downdetector.com/status/level3/map/)

If you are technology savvy, you can add `eventbrite.com` with it's IP address into your so called `hosts` config file
(available on Linux, Mac OSX and on Windows as well). Some operating systems may need a restart. Example hosts entry line: `52.44.84.44 eventbrite.com`.
Other possible IP addresses: `52.54.131.8`, `52.54.78.128`, `52.54.35.251`, `52.54.210.77`, `52.54.122.214`, `52.54.227.46`. This is the way
I got some servers (like some ubuntu servers) working on my machine.

## The attack in the news:

* [PC World: Major DDoS attack on Dyn DNS knocks Spotify, Twitter, Github, PayPal, and more offline](http://www.pcworld.com/article/3133847/internet/ddos-attack-on-dyn-knocks-spotify-twitter-github-etsy-and-more-offline.html)
* [The Verge: Denial-of-service attacks are shutting down major websites across the internet](http://www.theverge.com/2016/10/21/13357344/ddos-attack-websites-shut-down)

## Technical details, geek food:

* It's not that those servers you cannot access are are down, but the DNS resolution suffers. So if you know the IP address of the server you cannot access, you can set up a hosts config rule (briefly mentioned above). If you do that, don't forget to remove it in the future though.
* How such an attack is possible? Brief informal technical analysis of such DDoS attacks: [Deep Inside a DNS Amplification DDoS Attack](https://blog.cloudflare.com/deep-inside-a-dns-amplification-ddos-attack/)
