# Lesson 4: Important Things to Know About Caching

Let's summarize what we know about Fastly caching in context of resources at our disposal and let's start
playing with them to understand how it all works.

We have:

- Origin - our backend server: [https://cdn-training-acc5b8byapdregby.westeurope-01.azurewebsites.net](https://cdn-training-acc5b8byapdregby.westeurope-01.azurewebsites.net)
    - It has some API endpoints implemented one of which is [/api/getdate](https://cdn-training-acc5b8byapdregby.westeurope-01.azurewebsites.net/api/getdate)
- Fastly service - a network of POPs (Point of Presence) that caches resources from our Origin: [https://cdn-training.global.ssl.fastly.net](https://cdn-training.global.ssl.fastly.net)

## Cache Key

Running:
```powershell
curl -X GET https://cdn-training-acc5b8byapdregby.westeurope-01.azurewebsites.net/api/getdate
```
will return (surprise, surprise): curent date and time. Subsequent requests will return the new date and time.

But runing:

```powershell
curl -X GET https://cdn-training.global.ssl.fastly.net/api/getdate
```
multiple times will return the same date and time. You need to wait exactly 1h since the first request to see
that value changed.

Interestingly, running:
```powershell
curl -X GET https://cdn-training.global.ssl.fastly.net/api/getdate?foo=bar
```
will return fress date and time in the first response but subsequent requests will again return the same date and time as before.

This hints us the the first important information:

> Fastly cache key is Host + Path + Query string parameters (essentially what you think about URL)

Let's have a look at some response headers from Fastly endpoint:
```powershell

curl -v https://cdn-training.global.ssl.fastly.net/api/getdate?bar=baz
< Age: 0
< X-Cache: MISS
```
Let's hit it again:
```powershell

curl -v https://cdn-training.global.ssl.fastly.net/api/getdate?bar=baz
< Age: 19
< X-Cache: HIT
```
You see what's going on? First request for the given cache key obviously means that the roundtrip to the origin is required. From that moment Fastly starts counting time for that key, to invalidate the cached entry when the time comes. Second request is a happy path where there's some content cached under the given cache key, it's a HIT, roundtrip to origin is not happening and you can see how old the cache entry is in the `Age` header.

> The default Fastly caching time (TTS) is 3600s

## Normalization

Let's imagine that you promote your website with some marketing email and you track how it goes using UTM attributes. You run two campaigns, track various sources, even track search terms in UTM attributes. That means that you can expect (hopefully) a lot of requests to your homepage but you still don't observe the promised performance gain (at least not at the level it was advertised). Why is that?

UTMs are query string parameters that generate a lot of variations of the full shape of URL. Consider 2 campaigns times few sources, times a lot of search terms:
- https://domain.com?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale_2025&utm_content=cta_button
- https://domain.com?utm_source=facebook&utm_medium=social&utm_campaign=spring_sale_2025&utm_content=carousel_ad
- https://domain.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale_2025&utm_term=discount+coupon
- https://domain.com?utm_source=affiliate_partner&utm_medium=affiliate&utm_campaign=spring_sale_2025&utm_content=blog_post


The result value is the number of separate cache entries created for essentially the same content - your homepage that does not change based on the query string params.

## Vary By

Let's now consider a scenario where your website greets user in his language. Your origin code recognizes geo by IP and renders Hello in the matching language. You go and test this feature and notice that you see *Bonjour!* instead of expected *Cześć*. Why is that?

The first user who happened to access your website just after the homepage cache expired was from France. The first miss caused the roundtrip to server and *Bonjour* got cached for 1h. This is the opposite of normalization, you want to split the cache based on some additional value. This is usually done via request header. The name of the header that you vary-by should be put in the Vary header. In our example, the Vary should probably be Accept-Language (I'm oversimplifying a bit, but you get the point).

## Normalization while vary'ing

Let's consider yet another scenario, where your application implements adaptive frontend. This means that there's completely different UI for desktop and for mobile browsers. Similar to previous case, you obviously need to split cache or you would end up with mobile of desktop frontend cached (depending on which device made the first request). The naive solution would be to split by User-Agent. That would do the trick but you would end up with at least as many cache entries ad in the UTM scenario - there's plaetheora of user agent strings per browser/os/version/etc. 

To solve that issue you want to introduce the middle step, where you take the User-Agent header and put it in a bucket, using for example regular expressions. You want to have a piece of code that will take user agent string as an input and will return one of two values: desktop or mobile as an output. Than you vary-by that value. Please note that this is a bit more advanced stuff but we'll get there, we just need to understand how Fastly processes requests and how we can plug into that pipeline. Please also note that this is a common scenario and Fastly itroduces some API which enable you to get some pretty advanced metadata about each request, like [client variable](https://www.fastly.com/documentation/reference/vcl/variables/client-request/client-platform-mobile/). We'll learn how to use it soon.
