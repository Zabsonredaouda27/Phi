// Test script to check the ChatPHI API endpoint
require('dotenv').config({ path: '.env.local' });

async function testChatAPI() {
  try {
    console.log('Testing ChatPHI API endpoint with message: "Hello"');
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }]
      })
    });
    
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response:', data);
    
    if (response.ok) {
      console.log('ChatPHI API is working correctly!');
    } else {
      console.error('ChatPHI API is not working correctly.');
    }
  } catch (error) {
    console.error('Error testing ChatPHI API:', error);
  }
}

// We need to start the server first before running this test
console.log('Please start the server with "npm run dev" before running this test.');
