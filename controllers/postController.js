const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase (move this outside the function to initialize once)
const supabase = createClient(
  'https://rdhzbttofofvybbnfxlk.supabase.co', // Replace with your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHpidHRvZm9mdnliYm5meGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM1MzIxNCwiZXhwIjoyMDUyOTI5MjE0fQ.a8_sHdX1DHo03zF_sTNXsIzHSyJbskVi589pSTQdWBo' // Replace with your Supabase API key
);
// Function to create a new post
const createPost = async (req, res) => {
    const { adminId, title, content } = req.body;

    try {
        // Insert into POST_SECTION table
        const { data, error } = await supabase
            .from('POST_SECTION')
            .insert([{ AdminID: adminId, Title: title, Content: content, Date_Posted: new Date() }]);

        if (error) throw error;

        res.status(200).json({ message: 'Post created successfully', data });
    } catch (error) {
        res.status(500).json({ error: 'Error creating post: ' + error.message });
    }
};

// Function to get a post by postId
const getPost = async (req, res) => {
    const { postId } = req.params; // Extract postId from URL parameters

    try {
        // Query the POST_SECTION table using the postId
        const { data, error } = await supabase
            .from('POST_SECTION')
            .select('*')
            .eq('PostID', postId) // Filter by PostID
            .single(); // Use single to return one record (specific post)

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({ post: data });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching post: ' + error.message });
    }
};

module.exports = {
    createPost,
    getPost
};
