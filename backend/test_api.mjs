import http from "http";
import { Buffer } from "buffer";

const boundary = "----FormBoundary" + Math.random().toString(36).slice(2);

function buildFormData(fields) {
    let body = "";
    for (const [key, value] of Object.entries(fields)) {
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
        body += `${value}\r\n`;
    }
    body += `--${boundary}--\r\n`;
    return Buffer.from(body, "utf-8");
}

const fields = {
    name: "TestProduct",
    price: "100",
    description: "Test description",
    description_type: "paragraph",
    video_url: "",
    keywords: "test",
    dose: JSON.stringify([{ crops: "Wheat", dose: "5ml" }]),
    composition: JSON.stringify([{ ingredients: "A", content: "10%" }]),
    specifications: JSON.stringify([{ parameters: "Color", value: "Green" }]),
};

const body = buildFormData(fields);

// Test with GET to see current product state
console.log("Fetching product 5 BEFORE update...");
const getReq1 = http.request(
    { hostname: "localhost", port: 5000, path: "/api/products/5", method: "GET" },
    (getRes) => {
        let getData = "";
        getRes.on("data", (chunk) => (getData += chunk));
        getRes.on("end", () => {
            try {
                const product = JSON.parse(getData);
                console.log("BEFORE - dose:", JSON.stringify(product.dose));
                console.log("BEFORE - name:", product.name);
            } catch (e) {
                console.log("Raw response:", getData);
            }
        });
    }
);
getReq1.end();

// Wait a bit then send PUT
setTimeout(() => {
    const options = {
        hostname: "localhost",
        port: 5000,
        path: "/api/products/5",
        method: "PUT",
        headers: {
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
            "Content-Length": body.length,
        },
    };

    console.log("\nSending PUT request to localhost:5000...");
    console.log("Sending dose:", fields.dose);
    const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
            console.log("Response status:", res.statusCode);
            console.log("Response body:", data);

            // Wait then fetch the product
            setTimeout(() => {
                const getReq = http.request(
                    { hostname: "localhost", port: 5000, path: "/api/products/5", method: "GET" },
                    (getRes) => {
                        let getData = "";
                        getRes.on("data", (chunk) => (getData += chunk));
                        getRes.on("end", () => {
                            try {
                                const product = JSON.parse(getData);
                                console.log("\nAFTER - Product dose:", JSON.stringify(product.dose));
                                console.log("AFTER - Product composition:", JSON.stringify(product.composition));
                                console.log("AFTER - Product specifications:", JSON.stringify(product.specifications));
                                console.log("AFTER - Product name:", product.name);
                            } catch (e) {
                                console.log("Raw response:", getData);
                            }
                        });
                    }
                );
                getReq.end();
            }, 1000);
        });
    });

    req.on("error", (e) => {
        console.error("Error:", e.message);
    });
    req.write(body);
    req.end();
}, 1000);
