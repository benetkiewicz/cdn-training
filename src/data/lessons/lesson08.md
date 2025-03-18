---
title: Advanced VCL
subtitle: Using ACLs, Edge dictionary and client API
premium: true
---

## ACLs

ACL stands for Access Control List. It is a simple data structure designed to store IP addresses. There's also VCL API to check whether a given value is present on the list. The most common applications for ACLs are:
* banning/blocking IP 
* tricking IP to consume fake response (very useful for scrapers!)
* origin dispatching per IP
* whitilisting IP (ex. to never get rate limiting)

Let's implement the simplest block feature. First we need to create the ACL:

![Create ACL](../../../public/lesson8/create-acl.png)

The only thing to privide on the Create ACL form is name. It should be self-explanatory because it will be used as a handle to reference to in the VCL. Note that right after ACL creation, Fastly will throw a warning about unused ACL. We'll fix it in a moment.

![Warning](../../../public/lesson8/warning.png)

We need a new snippet:
* **Name:** Handle blacklist
* **Type:** recv
* **VCL**:

```varnish

if (client.ip ~ blacklist) {
  error 401 "Unauthorized";
}
```

After this configuration will be activated, nothing will change until you add an entry to the blacklist ACL. Try accessing any of the Fastly endpoints we added so far and they should work. Then find and add your IP to the blacklist. Note that ACL entries are cross-configuration entities - once you created ACL and activated configuration containing it, you can add and remove entries while this configuration (and subsequent configurations) are applied. Changes are almost real-time.

```varnish

curl -v https://cdn-training.global.ssl.fastly.net/api/getdate
< HTTP/1.1 401 Unauthorized
```

## Edge Dictionaries

Edge dictionaries are data structures very similar to dictionaries we know from other high-level programming languages, just hosted and distributed on POPs. They are simple key-value pairs with VCL API to check presence of the key and read value under the key. They are common in the following scenarios:
* feature flags
* route maps
* traffic dispatching
* storing configuration values