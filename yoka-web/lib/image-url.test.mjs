import assert from "node:assert/strict";
import { test } from "node:test";
import { imageUrl } from "./image-url.ts";

test("uploaded images resolve consistently across API path and host formats", () => {
  const oldHost = process.env.NEXT_PUBLIC_HOST_IMAGE;
  const oldApi = process.env.NEXT_PUBLIC_API_URL;
  try {
    for (const host of ["https://api.example.com", "https://api.example.com/"]) {
      process.env.NEXT_PUBLIC_HOST_IMAGE = host;
      for (const path of ["uploads/courses/poster.jpg", "/uploads/courses/poster.jpg", "uploads\\courses\\poster.jpg"]) {
        assert.equal(imageUrl(path), "https://api.example.com/uploads/courses/poster.jpg");
      }
    }
    assert.equal(imageUrl("https://cdn.example.com/course.jpg"), "https://cdn.example.com/course.jpg");
    assert.equal(imageUrl(" uploads/courses/my photo.jpg "), "https://api.example.com/uploads/courses/my%20photo.jpg");
    for (const value of [null, undefined, "", "  ", "javascript:alert(1)", "//other.example/image.jpg"]) {
      assert.equal(imageUrl(value), "");
    }
    delete process.env.NEXT_PUBLIC_HOST_IMAGE;
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3101/api/v1";
    assert.equal(imageUrl("/uploads/course.jpg"), "http://localhost:3101/uploads/course.jpg");
    delete process.env.NEXT_PUBLIC_API_URL;
    assert.equal(imageUrl("uploads/course.jpg"), "https://api.yogabyniti.com/uploads/course.jpg");
    process.env.NEXT_PUBLIC_HOST_IMAGE = "not a URL";
    assert.equal(imageUrl("uploads/course.jpg"), "");
  } finally {
    if (oldHost === undefined) delete process.env.NEXT_PUBLIC_HOST_IMAGE;
    else process.env.NEXT_PUBLIC_HOST_IMAGE = oldHost;
    if (oldApi === undefined) delete process.env.NEXT_PUBLIC_API_URL;
    else process.env.NEXT_PUBLIC_API_URL = oldApi;
  }
});
